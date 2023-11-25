import React from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'

const ChatLoading = props => {
  return (
    <Stack>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
        <Skeleton height="45px"/>
    </Stack>
  )
}

export default ChatLoading