import authClient from "./auth";

class InboxClient {
    list(coopId: string, page: number, success:(response: ListInboxResponse) => void) {
        authClient.get("/inbox/" + coopId + "/list/" + page,
            (response) => success(response.data))
    }

    countNew(coopId: string, success:(response: number) => void) {
        authClient.get("/inbox/" + coopId + "/count-new",
            (response) => success(response.data))
    }

    delete(coopId: string, messageId: string, success:() => void) {
        authClient.delete("/inbox/" + coopId + "/" + messageId, () => success())
    }

    markRead(coopId: string, messageId: string, success:() => void) {
        authClient.post("/inbox/" + coopId + "/" + messageId + "/read", {}, () => success())
    }
}

export interface ListInboxResponse {
    messages: InboxMessage[]
}

export interface InboxMessage {
    id?: string;
    severity: string;
    createdTs: string;
    readTs: string;
    archivedTs: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
}

export default new InboxClient();