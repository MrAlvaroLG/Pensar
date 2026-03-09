export const DEBATE_TEAMS = ["red", "blue", "public"] as const
export type DebateTeam = (typeof DEBATE_TEAMS)[number]

export const DEBATE_REGISTRATION_STATUSES = ["participant", "orator", "reserve"] as const
export type DebateRegistrationStatus = (typeof DEBATE_REGISTRATION_STATUSES)[number]

export type ViewerTeam = "none" | DebateTeam

export const POSTURA_VALUES = ["TEISTA", "ATEO", "AGNOSTICO", "DEISTA", "PANTEISTA", "OTRO"] as const
export type PosturaValue = (typeof POSTURA_VALUES)[number]

export const TEAM_OPTIONS: Array<{ value: DebateTeam; label: string }> = [
    { value: "red", label: "Rojo" },
    { value: "blue", label: "Azul" },
    { value: "public", label: "Publico" },
]

export const STATUS_OPTIONS: Array<{ value: DebateRegistrationStatus; label: string }> = [
    { value: "participant", label: "Participante" },
    { value: "orator", label: "Orador" },
    { value: "reserve", label: "Reserva" },
]

export const POSTURA_OPTIONS: Array<{ value: PosturaValue; label: string }> = [
    { value: "TEISTA", label: "Teista" },
    { value: "ATEO", label: "Ateo" },
    { value: "AGNOSTICO", label: "Agnostico" },
    { value: "DEISTA", label: "Deista" },
    { value: "PANTEISTA", label: "Panteista" },
    { value: "OTRO", label: "Otra / Prefiero no decir" },
]

export type DebateTeamRouteParam = "rojo" | "azul" | "publico"

export const ROUTE_TO_TEAM: Record<DebateTeamRouteParam, DebateTeam> = {
    rojo: "red",
    azul: "blue",
    publico: "public",
}

export function isDebateTeam(value: unknown): value is DebateTeam {
    return typeof value === "string" && DEBATE_TEAMS.includes(value as DebateTeam)
}

export function isDebateRegistrationStatus(value: unknown): value is DebateRegistrationStatus {
    return typeof value === "string" && DEBATE_REGISTRATION_STATUSES.includes(value as DebateRegistrationStatus)
}

export function isPosturaValue(value: unknown): value is PosturaValue {
    return typeof value === "string" && POSTURA_VALUES.includes(value as PosturaValue)
}

export function isDebateTeamRouteParam(value: string): value is DebateTeamRouteParam {
    return value in ROUTE_TO_TEAM
}

export function getTeamLabel(team: DebateTeam): string {
    return TEAM_OPTIONS.find((option) => option.value === team)?.label ?? team
}

export function getStatusLabel(status: DebateRegistrationStatus): string {
    return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}
