const theme: AppTheme = {
  appName: "Goldminer",
  mainColor: "#e69a1e",
  mainColorGradient:
    "linear-gradient(45deg, rgba(230,154,30,1) 0%, rgba(237,184,97,1) 100%)",
  minerTheme: {
    graphGradient: ["rgba(250,174,50,0.75)", "rgba(250,174,50,0)"],
  },
  navBar: { height: "65px" },
  appPadding: "15px",
  topBar: {
    height: "28px",
  },
};

interface AppTheme {
  appName: string;
  mainColor: string;
  mainColorGradient: string;
  minerTheme: {
    graphGradient: [string, string]; // [top, bottom]
  };
  navBar: {
    height: string;
  };
  appPadding: string;
  topBar: {
    height: string; // e.g. "28px"
  };
}

export default theme;
