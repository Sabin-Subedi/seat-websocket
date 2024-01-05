/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Container, Flex, Skeleton, Table, TableTbody } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import useSocket from './hooks/useSocket'
import myAxios from './lib/axios'
import { socket } from './lib/socket'

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


    useEffect(() => {
        socket.on('seat-selection-error', (data: any) => {
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
                    const newSeats = [...seats]
                    newSeats[data.row].row_seats[seatIndex] = data
                    setSeats(newSeats)
                }
            }
        })

        socket.on('seat-layout-change', (data: RowSeat) => {
            const seatRow = seats[data.row]
            if (seatRow) {
                const seatIndex = seatRow.row_seats.findIndex((seat) => seat.idx === data.idx)
                const newSeats = [...seats]
                newSeats[data.row].row_seats[seatIndex] = data
                setSeats(newSeats)
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
                <Checkbox color='green' label='Available' />
                <Checkbox checked color='grape' label='Selected' />
                <Checkbox checked color='yellow' label='Booked' />
                <Checkbox checked color='red' label='Sold' />
                <Checkbox checked color='gray' label='Blocked' disabled />
            </Flex>
            <Skeleton visible={isLoading}>
                <Table horizontalSpacing="sm" verticalSpacing="md" withRowBorders={false}>
                    <TableTbody>
                        {seats?.map((seat: Seat) => (
                            <Table.Tr key={seat.idx}>
                                <Table.Td>{seat.row_name}</Table.Td>
                                {seat.row_seats?.map((row_seat) => row_seat.is_active && (
                                    <Table.Td style={{
                                        cursor: 'pointer'
                                    }} key={row_seat.idx + row_seat.is_selected}>
                                        <Checkbox
                                            onChange={() => {
                                                socket.emit('select-seat', {
                                                    seat_idx: row_seat.idx,
                                                })
                                            }}
                                            checked={row_seat.is_selected}
                                            color={(row_seat.is_blocked || !row_seat.can_select && row_seat.is_selected) ? 'gray' : row_seat.is_selected ? 'grape' : row_seat.can_select ? 'green' : 'gray'}
                                            disabled={row_seat.is_blocked || !row_seat.can_select || !isConnected}
                                        />
                                        {row_seat.seat_label}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </TableTbody>
                </Table>
            </Skeleton>
        </Container>
    )
}

export default SeatRender