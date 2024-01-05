import {
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useAuth } from '../authContext';


export default function Authentication() {
    const { signin } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

    });
    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="button">
                    Create account
                </Anchor>
            </Text>

            <Paper component='form' withBorder shadow="md" p={30} mt={30} radius="md" onSubmit={
                form.onSubmit(async (values) => {
                    try {
                        setIsLoading(true)
                        await signin(values)
                    } finally {
                        setIsLoading(false)
                    }
                })}>
                <TextInput label="Email" required {...form.getInputProps('email')} />
                <PasswordInput label="Password" required mt="md" {...form.getInputProps('password')} />
                <Button fullWidth mt="xl" type='submit' loading={isLoading}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}