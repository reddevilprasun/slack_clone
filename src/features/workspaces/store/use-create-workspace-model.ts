import { atom , useAtom} from "jotai";

const modalAtom = atom(false);

export const useCreateWorkspaceModel = () => {
  return useAtom(modalAtom);
};