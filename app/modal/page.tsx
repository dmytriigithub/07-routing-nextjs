import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import ModalClient from "./Modal.client";

const Modal = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModalClient />
    </HydrationBoundary>
  );
};

export default Modal;
