'use client';

type LightsProps = { directionalIntensity?: number; ambientIntensity?: number; position?: [number, number, number] };

const Lights = ({ directionalIntensity = 4.5, ambientIntensity = 1.5, position = [6, 4, 1] }: LightsProps = {}) => {
    return (
        <>
            <directionalLight
                castShadow
                position={position}
                intensity={directionalIntensity}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
            />
            <ambientLight intensity={ambientIntensity} />
        </>
    );
};

export default Lights;
