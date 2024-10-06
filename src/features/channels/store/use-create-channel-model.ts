import { atom , useAtom} from "jotai";

const modalAtom = atom(false);

export const useCreateChannelModel = () => {
  return useAtom(modalAtom);
};