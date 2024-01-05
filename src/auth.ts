const authService = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authService.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    authService.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export { authService };
