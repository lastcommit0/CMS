export const getManagerId = (role: string) => {
    switch (role) {
        case "ADMIN":
            return [];
        case "SUB_ADMIN":
            return ["ADMIN", "SUB_ADMIN"];
        case "EDITOR":
            return ["ADMIN", "SUB_ADMIN", "EDITOR"];
        default:
            return [];
    }
}