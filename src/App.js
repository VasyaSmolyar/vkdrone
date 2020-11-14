import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import Choiсe from './panels/Choice';
import Order from './panels/Order';

const App = () => {
	const [activePanel, setActivePanel] = useState('choice');
	const [fetchedUser, setUser] = useState(null);
	const [friend, setFriend] = useState(null);
	const [recv, setRecv] = useState(null);
	const [order, setOrder] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const createOrder = (user_id, sendGeo, recvGeo, comment) => {
		bridge.send("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "7660830", 
		"params": {"user_ids": user_id, "v":"5.126","fields": "photo_200" , "access_token":
		"5126aec75126aec75126aec73451524bd9551265126aec70e8b3645ad512894c48650a1"}}).then((data) => {
			console.log(data);
			setRecv(data.response[0]);
			setActivePanel('order')
		});
	};

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			const res = await bridge.send("VKWebAppGetFriends", {});
			const fr = res.users[0];
			setFriend(fr);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' fetchedUser={fetchedUser} go={go} />
			<Choiсe id='choice' fetchedUser={friend} createOrder={createOrder} />
			<Order id='order' fetchedUser={recv} />
			<Persik id='persik' go={go} />
		</View>
	);
}

export default App;

