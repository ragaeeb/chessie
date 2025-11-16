import Pusher from "pusher";
import { getAssignment } from "./utils/gameStore";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const pusher = new Pusher({
  appId: required("PUSHER_APP_ID"),
  key: required("PUSHER_KEY"),
  secret: required("PUSHER_SECRET"),
  cluster: required("PUSHER_CLUSTER"),
  useTLS: true,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const parseBody = (body: string | null, contentType?: string) => {
  if (!body) {
    return {} as Record<string, string>;
  }

  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(body) as Record<string, string>;
    } catch (error) {
      console.error("Failed to parse JSON auth payload", error);
      return {} as Record<string, string>;
    }
  }

  const params = new URLSearchParams(body);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const channelSuffix = (channelName: string, prefix: string) =>
  channelName.startsWith(prefix) ? channelName.slice(prefix.length) : null;

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const payload = parseBody(event.body, event.headers["content-type"] ?? event.headers["Content-Type"]);
  const socketId = payload.socket_id;
  const channelName = payload.channel_name;
  const playerId = payload.playerId ?? payload.player_id;

  if (!socketId || !channelName || !playerId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing authentication parameters" }),
    };
  }

  try {
    if (channelName.startsWith("private-player-")) {
      const requestedPlayer = channelSuffix(channelName, "private-player-");
      if (requestedPlayer !== playerId) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Cannot subscribe to another player's channel" }),
        };
      }

      const auth = pusher.authorizeChannel(socketId, channelName);
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      };
    }

    if (channelName.startsWith("private-game-") || channelName.startsWith("presence-game-")) {
      const suffix = channelName.replace(/^(private|presence)-game-/, "");
      const assignment = await getAssignment(playerId);

      if (!assignment || assignment.gameId !== suffix) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Player is not part of this game" }),
        };
      }

      if (channelName.startsWith("presence-game-")) {
        const auth = pusher.authorizeChannel(socketId, channelName, {
          user_id: playerId,
          user_info: { color: assignment.color },
        });
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(auth),
        };
      }

      const auth = pusher.authorizeChannel(socketId, channelName);
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      };
    }

    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Unknown channel" }),
    };
  } catch (error) {
    console.error("Failed to authorize Pusher channel", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to authorize" }),
    };
  }
};
