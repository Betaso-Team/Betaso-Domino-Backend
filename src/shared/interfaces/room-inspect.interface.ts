import { TrucoRoomState } from '../../rooms/schemas/truco-room-state'

/**
 * Interface para el resultado de getInspectData() de una sala de Truco
 */
export interface TrucoRoomInspectData {
    // Datos disponibles de la sala (de getAvailableData())
    roomId: string
    name: string
    maxClients: number
    metadata?: any
    
    // Estado de la sala
    locked: boolean
    
    // Clientes conectados con información de tiempo
    clients: Array<{
        sessionId: string
        elapsedTime: number // Tiempo en milisegundos que lleva conectado
    }>
    
    // Estado completo de la sala de Truco
    state: TrucoRoomState
    
    // Tamaño del estado en bytes
    stateSize: number
}

/**
 * Interface genérica para cualquier sala de Colyseus
 */
export interface RoomInspectData<T = any> {
    roomId: string
    name: string
    maxClients: number
    metadata?: any
    locked: boolean
    clients: Array<{
        sessionId: string
        elapsedTime: number
    }>
    state: T
    stateSize: number
}

/**
 * Interface para información básica de cliente conectado
 */
export interface ConnectedClient {
    sessionId: string
    elapsedTime: number
}

/**
 * Interface para datos de sala disponibles (getAvailableData)
 */
export interface RoomAvailableData {
    roomId: string
    name: string
    clients: number
    maxClients: number
    metadata?: any
}
