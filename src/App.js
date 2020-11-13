import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import Choiсe from './panels/Choice';

const App = () => {
	const [activePanel, setActivePanel] = useState('choice');
	const [fetchedUser, setUser] = useState(null);
	const [friend, setFriend] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

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
			<Choiсe id='choice' fetchedUser={friend} />
			<Persik id='persik' go={go} />
		</View>
	);
}

export default App;

