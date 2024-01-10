/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myAxios from "./lib/axios";

interface loginValues {
  email: string;
  password: string;
}
interface loginResponse {
  access_token: string
  expires_in: number
}
interface MeResponse {
  "idx": string,
  "username": string,
  "email": string,
  "is_email_verified": boolean,
  "is_staff": boolean,
  "is_hall_staff": boolean,
  "is_registered_user": boolean,
  "is_superuser": boolean,
  "cinema_halls": {
    idx: string
  }[],
}

interface AuthContextType {
  user: unknown;
  signin: (values: loginValues) => void;
  signout: () => void;
}



export const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = React.useState<any>(null);
  const router = useNavigate()

  const getMe = useCallback(async () => {
    const { data } = await myAxios.get('/users/me')
    const meData = data?.data as MeResponse

    if (meData) {
      setUser(meData)
      router('/seatSelection')
      return
    }
    router('/login')
  }, [router])

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        if (token) {
          myAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          await getMe()
        } else {
          router('/login')
        }
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.clear()
        }
        notifications.show({
          title: 'Login Error',
          message: e?.response?.message || e?.message,
          color: 'red',
          autoClose: 5000,
        })
        router('/login')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [getMe, router])



  const signin = async (values: loginValues) => {
    try {
      const { data } = await myAxios.post('/auth/login', values)
      const loginData = data?.data as loginResponse
      if (loginData.access_token) {
        localStorage.setItem('token', loginData.access_token)
        myAxios.defaults.headers.common['Authorization'] = `Bearer ${loginData.access_token}`
        await getMe()
      }
      throw new Error('Something went wrong')
    } catch (e) {
      notifications.show({
        title: 'Login Error',
        message: e?.response?.message || e?.message,
        color: 'red',
        autoClose: 5000,
      })
    }

  };

  const signout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router('/login')
    notifications.show({
      title: 'Logged out',
      message: 'You have been logged out',
      color: 'blue',
      autoClose: 5000,
    })
  };

  const value = { user, signin, signout };
  if (isLoading) return <Box style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
  }}>
    <Loader />
  </Box>
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
