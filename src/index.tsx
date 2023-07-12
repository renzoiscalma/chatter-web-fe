import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Hero from "./components/Chatter/Hero";
import ThemeProvider from "./components/Chatter/ThemeProvider";
import UserContextProvider from "./components/Chatter/UserContextProvider";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_LOCAL_BACKEND_URI,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_LOCAL_WS_URL
      ? process.env.REACT_APP_LOCAL_WS_URL
      : "",
    // connectionParams: { TODO !!!!!
    //   authToken: userEvent.Token
    // }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const router = createBrowserRouter(
  [
    {
      index: true,
      path: "",
      element: <Hero />,
      errorElement: <Hero />,
    },
    {
      path: "/lobbyId/:id",
      element: <App />,
    },
  ],
  {
    basename: `${process.env.PUBLIC_URL}`,
  }
);

// redirect dev to url
if (process.env.NODE_ENV === "development") {
  if (window.location.pathname === "/") {
    window.location.assign(`${process.env.PUBLIC_URL}`);
  }
}

root.render(
  <ApolloProvider client={client}>
    <UserContextProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserContextProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
