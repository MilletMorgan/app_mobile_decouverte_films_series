import { flow, makeAutoObservable, makeObservable, observable, reaction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure } from "mobx"

configure({
    enforceActions: "never",
})

class User {
    username = '';
    password = '';
    session_id = '';
    isSignedIn = false;

    constructor() {
        makeAutoObservable(this);
    }
}

class LoginStore {
    user = new User();

    signUserInOut = flow(function* (bool) {
        try {
            this.user.isSignedIn = bool;
            yield AsyncStorage.setItem('user', JSON.stringify(this.user));
        } catch (err) {
            console.error(err);
        }
    }).bind(this);

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => [this.user.username, this.user.password],
            async () => {
                await AsyncStorage.setItem('user', JSON.stringify(this.user));
            }
        );
    }
}

const loginStore = new LoginStore();
export { loginStore };
