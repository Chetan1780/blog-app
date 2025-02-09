export const getEnv = (envname) => {
    return import.meta.env[envname]; 
};
