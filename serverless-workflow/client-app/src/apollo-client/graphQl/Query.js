import { gql } from "@apollo/client";

export const LIST_ACTIVITY_BY_CUSTOMER_USER = gql`
    query listUserActivitiesByCustomerAndUser($customer:String!,$user:String!) {
            getuserActivitiesByCustomerAndUser(customer: $customer, user: $user) {
            customer
            user
            fileName
            fileSize
            uploadTime
        }
    }
`;

