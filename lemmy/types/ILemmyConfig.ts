interface ILemmyConfig {
    baseUrl: string,
    headers?: {
        "x-real-ip"?: string,
        "x-forwarded-for"?: string
    }
}

export default ILemmyConfig;