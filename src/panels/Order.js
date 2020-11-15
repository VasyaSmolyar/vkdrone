import React, { useRef, useEffect, useState } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

const Order = ({ id, order, fetchedUser }) => {

    let msUTC = Date.parse(order.date_create);
    msUTC += order.minutes * 60 * 1000;
    let date = new Date(msUTC);

    return (
        <Panel id={id}>
		    <PanelHeader>Доставка</PanelHeader>
            <Group title="Header">
                <Cell
                    before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                    description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                >
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Cell>
            </Group>
            <Div>
                <Header>Доставим в {date.getHours()}:{date.getMinutes()}</Header>
                <Cell>{order.comment}</Cell>
            </Div>
        </Panel>
    );
}

export default Order;