import customers from '../data/Customers';
let initialState = {
    filerOptions: {
        selectedCustomer: customers[0],
        selectedUser: customers[0].Users[0],
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