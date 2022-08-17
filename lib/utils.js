
export function assembleTypesenseServerConfig() {

    let TYPESENSE_SERVER_CONFIG = {
   
        apiKey: "local-typesense-api-key",
        nodes: [
            {
                host: "docker-dev.butler.edu",
                port: "8108",
                protocol: 'https'
            }
        ],
        numRetries: 8,
        connectionTimeoutSeconds: 2
    };

    return TYPESENSE_SERVER_CONFIG;
}
