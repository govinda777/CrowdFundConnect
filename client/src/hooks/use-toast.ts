// Inspired by react-hot-toast library
import { useState, useEffect, useCallback, ReactNode } from "react";

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "destructive";
};

export type Toast = ToastProps & {
  open: boolean;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToastProps;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToastProps>;
      id: string;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      id: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      id: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            ...action.toast,
            id: action.toast.id || genId(),
            open: true,
            onOpenChange: (open: boolean) => {
              if (!open) {
                dispatch({
                  type: "DISMISS_TOAST",
                  id: action.toast.id || "",
                });
              }
            },
          },
        ].slice(-TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { id } = action;

      // Cancel any existing timeout
      if (toastTimeouts.has(id)) {
        clearTimeout(toastTimeouts.get(id));
        toastTimeouts.delete(id);
      }

      // Set timeout for removing the toast
      const timeout = setTimeout(() => {
        dispatch({
          type: "REMOVE_TOAST",
          id,
        });
      }, TOAST_REMOVE_DELAY);

      toastTimeouts.set(id, timeout);

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, open: false } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

export function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const toast = useCallback(
    (props: ToastProps) => {
      dispatch({
        type: "ADD_TOAST",
        toast: props,
      });
    },
    []
  );

  return {
    ...state,
    toast,
    dismiss: (id: string) => dispatch({ type: "DISMISS_TOAST", id }),
  };
}
