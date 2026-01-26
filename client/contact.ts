import authClient from "./auth";

class ContactClient {
    list(coopId: string, success:(response: ListContactResponse) => void) {
        authClient.get("/contacts/" + coopId + "/list",
            (response) => success(response.data))

    }

    add(coopId: string, request: AddContactRequest, success:(response: AddContactResponse) => void) {
        authClient.put("/contacts/" + coopId + "/add",
            request,
            (response) => success(response.data))

    }

    update(coopId: string, request: UpdateContactRequest, success:(response: UpdateContactResponse) => void) {
        authClient.put("/contacts/" + coopId + "/update",
            request,
            (response) => success(response.data))

    }

    delete(coopId: string, contactId: string, success:() => void) {
        authClient.delete("/contacts/" + coopId + "/" + contactId, () => success())

    }
}

export interface ListContactResponse {
    contacts: Contact[]
}

export interface AddContactResponse {
    contact: Contact
}
export interface AddContactRequest {
    contact: Contact
}

export interface UpdateContactResponse {
    contact: Contact
}
export interface UpdateContactRequest {
    contact: Contact
}

export interface Contact {
    id?: string;
    displayName: string;
    email: string;
    phone: string;
}

export default new ContactClient();