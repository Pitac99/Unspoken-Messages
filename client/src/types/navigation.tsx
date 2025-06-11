export type RootStackParamList = {
  Intro: undefined;
  PinSetup: undefined;
  PinAuth: undefined;
  Home: undefined;
  Chat: { contactId: string };
  ContactSelection: undefined;
  Settings: undefined;
  Terms: { fromSettings?: boolean };
  About: undefined;
}; 