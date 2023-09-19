export function changeFilterOptions(changedData) {
    return {
        type: "FileterOptionChanged",
        payload: changedData
    }
}
export function userActivityAdded() {
    return {
        type: "UserActivityAdded"
    }
}