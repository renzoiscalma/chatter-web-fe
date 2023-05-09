// module augmentation for new theme to accept colors as per
// https://mui.com/material-ui/customization/theming/#custom-variables
// note: we can use predefined primary and secondary, however I want to use custom
// theme just for the sake of demonstration
declare module "@mui/material/styles" {
  export interface Theme {
    chat: {
      bubbleFrom: string;
      bubbleTo: string;
      bgColor: string;
    };
    common: {
      text: {
        primary: string;
        secondary: string;
        tertiary?: string;
        accept?: string;
        decline?: string;
      };
      base: string;
    };
    appBar: {
      bgColor: string;
    };
    modal?: {
      bgColor?: string;
    };
    button?: {
      cancelTextColor?: string;
      confirmTextColor?: string;
    };
    textInput?: {
      sendBgColor?: string;
      textColor?: string;
      borderColor?: string;
    };
  }

  export interface ThemeOptions {
    chat?: {
      bubbleFrom?: string;
      bubbleTo?: string;
      bgColor?: string;
    };
    common?: {
      text?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
        accept?: string;
        decline?: string;
      };
      base?: string;
    };
    appBar?: {
      bgColor?: string;
    };
    modal?: {
      bgColor?: string;
    };
    button?: {
      cancelTextColor?: string;
      confirmTextColor?: string;
    };
    textInput?: {
      sendBgColor?: string;
      textColor?: string;
      borderColor?: string;
    };
  }
}

export {};
