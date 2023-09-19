let initialState = {
    filerOptions: {
        selectedCustomer: {},
        selectedUser: {},
        startDate: '',
        endDate: ''
    },
    totalUserActivities: 0
};
const UserActivityReducer = (state = initialState, action) => {
    if (action.type === "FileterOptionChanged") {
        return {
            ...state,
            filerOptions: action.payload,
        }
    }
    else if (action.type === "UserActivityAdded") {
        return {
            ...state,
            totalUserActivities: state.totalUserActivities + 1,
        }
    }
    else {
        return state
    }
}
export default UserActivityReducer;