import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache
} from "@apollo/client";

const region = process.env.REACT_APP_AWS_REGION;
const apiKey = process.env.REACT_APP_GRAPHQL_API_KEY;
const url = process.env.REACT_APP_GRAPHQL_API_URL;

const auth = {
  type: "API_KEY",
  apiKey: apiKey
};

const httpLink = new HttpLink({ uri: url });
const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloWrapper;
 