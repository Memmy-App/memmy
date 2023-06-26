interface UseNotifications {
  register: () => Promise<void>;
}

const useNotifications = (): UseNotifications => {
  const register = async () => {
    let token;

    if(Device)
  }
}