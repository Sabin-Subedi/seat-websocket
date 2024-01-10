/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Alert, Button, Checkbox, Container, Flex, Grid, Skeleton, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import useSocket from './hooks/useSocket'
import myAxios from './lib/axios'
import { socket } from './lib/socket'
import { SeatIcon } from "./Seat.tsx";
import Countdown from 'react-countdown'

interface RowSeat {
    idx: string,
    is_active: boolean,
    seat_label: string,
    row: number,
    column: number,
    is_custom_seat: boolean,
    is_blocked: boolean,
    ticket_price: number,
    can_select: boolean,
    is_selected: boolean,
    icon: string,

}
interface Seat {
    idx: string,
    row_name: string,
    seat_number: string,
    row_seats: RowSeat[]
}

function SeatRender() {
    const [isLoading, setIsLoading] = useState(false)
    const [seats, setSeats] = React.useState<Seat[]>([])
    const { isConnected } = useSocket()
    const [timer, setTimer] = useState<null | number>(null)


    useEffect(() => {
        socket.on('seat-error', (data: any) => {
            notifications.show({
                title: 'Seat Selection Error',
                message: data.message,
                variant: 'filled',
                color: 'red',

            })
        })
        socket.on('select-seat', (data: RowSeat) => {
            if (data.row) {
                const seatRow = seats[data.row]
                if (seatRow) {
                    const seatIndex = seatRow.row_seats.findIndex((seat) => seat.idx === data.idx)
                    const updatedSeat = [...seats]
                    updatedSeat[data.row].row_seats[seatIndex] = data
                    setSeats(updatedSeat)
                }
            }
        })

        socket.on('unselect-seat', (data: RowSeat) => {
            if (data.row) {
                const seatRow = seats[data.row]
                if (seatRow) {
                    const seatIndex = seatRow.row_seats.findIndex((seat) => seat.idx === data.idx)
                    const updatedSeat = [...seats]
                    updatedSeat[data.row].row_seats[seatIndex] = data
                    setSeats(updatedSeat)
                }
            }
        })

        socket.on('seat-layout-change', (data: RowSeat[]) => {
            const updatedSeat = [...seats]
            if (data.length > 0) {
                for (const seat of data) {
                    const seatRow = updatedSeat[seat.row]
                    if (!seatRow) {
                        continue
                    }
                    const seatIndex = seatRow.row_seats.findIndex((s) => s.idx === seat.idx)
                    if (seatIndex === -1) {
                        continue
                    }

                    updatedSeat[seat.row].row_seats[seatIndex] = seat
                }
                setSeats(updatedSeat)
            }
        })
    }, [seats])





    useEffect(() => {
        setIsLoading(true)
        myAxios.get('seats/shw_hXAgC4Y2IRyPqrFN77OaKr').then((res) => {
            setSeats(res.data.data)
        }).catch((err) => {
            notifications.show({
                title: 'Seat Render Error',
                message: err?.response?.message || err?.message,
                variant: 'filled',
                color: 'red',

            })
        })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    return (
        <Container style={{
            width: '100%',
        }}>
            <Flex align="center" justify='center' py={16} gap="1.5rem">
                <Button color='green' variant='transparent' size='sm' leftSection={<SeatIcon />} aria-readonly={true}>Available</Button>
                <Button color='grape' variant='transparent' size='sm' leftSection={<SeatIcon />} aria-readonly={true}>Selected</Button>
                <Button color='yellow' variant='transparent' size='sm' leftSection={<SeatIcon />} aria-readonly={true}>Booked</Button>
                <Button color='red' variant='transparent' size='sm' leftSection={<SeatIcon />} aria-readonly={true}>Sold</Button>
                <Button color='gray' variant='transparent' size='sm' leftSection={<SeatIcon />} aria-readonly={true}>Blocked</Button>
            </Flex>
            {timer && <Alert variant="light" color="red" style={{
                color: 'red'
            }} >
                Your seat will be automatically unselected in:  <Countdown
                    onComplete={() => {
                        setTimer(null)
                    }}
                    onStop={() => {
                        setTimer(null)
                    }}
                    date={Date.now() + timer} />
            </Alert>}
            <Skeleton visible={isLoading}>
                {seats && <Grid w="100%" columns={seats[0]?.row_seats.length + 1}>
                    {seats?.map((row: Seat) => (
                        <>
                            <Grid.Col span={1} key={row.idx} >
                                <Checkbox onChange={(e) => {

                                    if (!e.target.checked) {

                                        socket.emit('unselect-row', {
                                            seat_row_idx: row.idx,
                                        })
                                    } else if (e.target.checked) {
                                        socket.emit('select-row', {
                                            seat_row_idx: row.idx,
                                        })
                                    }
                                }} size="sm" color="grape"
                                    label={row.row_name}
                                    checked={row.row_seats.some(s => s.is_selected && s.can_select)}
                                    disabled={!isConnected || row.row_seats.every(s => !s.can_select)} />

                            </Grid.Col>
                            {row.row_seats?.map((row_seat) => (
                                <Grid.Col span={1} key={row_seat.idx} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <ActionIcon
                                        onClick={() => {

                                            if (!row_seat.can_select) return

                                            if (row_seat.is_selected) {
                                                socket.emit('unselect-seat', {
                                                    seat_idx: row_seat.idx,
                                                })
                                                return
                                            }
                                            setTimer(10 * 1000)
                                            socket.emit('select-seat', {
                                                seat_idx: row_seat.idx,
                                            })
                                        }}
                                        disabled={row_seat.is_blocked || !row_seat.can_select || !isConnected}
                                        color={row_seat.is_blocked ? 'gray' : row_seat.is_selected ? 'grape' : row_seat.can_select ? 'green' : 'gray'}
                                        variant='subtle'
                                        size='md'
                                    >
                                        <SeatIcon />
                                    </ActionIcon>
                                    <Text style={{ textAlign: 'center' }}>{row_seat.seat_label}</Text>
                                </Grid.Col>
                            )
                            )}
                        </>
                    ))}
                </Grid>
                }
            </Skeleton>
        </Container>
    )
}

export default SeatRender