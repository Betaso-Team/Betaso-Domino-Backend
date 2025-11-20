export interface User {
    uuid: string
    firstName: string
    lastName: string
    username: string
    cardId: string | null
    email: string
    contactEmail: string | null
    role: string
    profilePicture: string | null
    modals: any  
}