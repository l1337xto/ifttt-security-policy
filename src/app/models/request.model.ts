export interface IFTTTRequest {
    thing: string;
    created: Date;
    content: request;
}
export interface request {
    appliance: string;
    operation: string;
}