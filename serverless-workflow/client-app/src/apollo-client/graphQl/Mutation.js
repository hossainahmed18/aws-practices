import { gql } from "@apollo/client";

export const ADD_USER_ACTIVITY = gql`
    mutation AddUserActivity($customer: String!, $fileName: String!, $fileSize: String!, $uploadTime: String!, $user: String!) {
        createUserAvtivity(input: {customer: $customer, fileName: $fileName, fileSize: $fileSize, uploadTime: $uploadTime, user: $user}) {
            customer
            fileName
            fileSize
            uploadTime
            user
        }
    }
` ;