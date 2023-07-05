// <a href="https://www.freepik.com/free-vector/friends-watching-horror-movie_7732623.htm#query=watchingmovie&position=3&from_view=keyword&track=ais#position=3&query=watchingmovie?log-in=google">Image by pch.vector</a> on Freepik
import { useTheme } from "@emotion/react";
import { useContext, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import { UsrContxt } from "./UserContextProvider";

function Hero(): JSX.Element {
  const userContext = useContext(UsrContxt);
  const theme = useTheme();

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return <Navbar></Navbar>;
}

export default Hero;
