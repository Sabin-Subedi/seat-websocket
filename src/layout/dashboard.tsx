import { Flex } from "@mantine/core"
import { NavbarNested } from "../components/navbar/Navbar"
import { Outlet } from "react-router-dom"

function Dashboard() {
    return (
        <Flex>
            <NavbarNested />
            <Outlet />
        </Flex>
    )
}

export default Dashboard