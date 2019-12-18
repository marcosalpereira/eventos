import { Injectable } from '@angular/core';
import { Subject, Subscription  } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Solicitation } from 'src/app/model/event';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData = new Subject<User>();
  authData$ = this.authData.asObservable();
  authStateSub: Subscription;
  user: User;

  constructor(
      private fireStore: AngularFirestore,
      private fireAuth: AngularFireAuth) {
    this.authStateSub = this.fireAuth.authState.subscribe(userData => {
      if (userData) {
        this.getUserData(userData.uid).then(user => {
          this.user = user;
          this.authData.next(user);
        });
      } else {
        this.user = null;
        this.authData.next(null);
      }
    });
  }

  googleLoggin(): void {
    this.authLogin(new auth.GoogleAuthProvider());
  }

  loggout() {
    this.user = null;
    this.fireAuth.auth.signOut();
    this.authData.next(null);
  }

  private authLogin(provider: auth.AuthProvider): void {
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.user = this.toUser(result.user);
        this.authData.next(this.user);
        this.setUserData(this.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }

  private toUser(fbuser: firebase.User): User {
    return {
      uid: fbuser.uid,
      email: fbuser.email,
      displayName: fbuser.displayName,
      photoURL: fbuser.photoURL,
    };
  }

  private setUserData(user: User): Promise<void> {
    const ref: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    return ref.set(user, {merge: true});
  }

  private async getUserData(uid: string): Promise<User> {
    return this.fireStore.doc(`users/${uid}`)
      .get().pipe(
        map(snapshot => snapshot.data() as User)
      ).toPromise();
  }

  userCanParticipateEvent(eventId: string): boolean {
    return this.user.eventsId
      && this.user.eventsId.findIndex(
        id => id === eventId) !== -1;
  }

  async eventAccessSolicitation(eventId: string) {
    this.solicitation$(eventId, this.user.uid)
      .set({
        _userId: this.user.uid,
        _eventId: eventId,
        _userName: this.user.displayName,
      }, {merge: true});
  }

  grantSolicitation(eventId: string, solicitation: Solicitation) {
    this.user.eventsId = [...this.user.eventsId, eventId];
    this.setUserData(this.user)
      .then( () =>
        this.removeSolicitation(eventId, solicitation) );
  }

  removeSolicitation(eventId: string, solicitation: Solicitation) {
    this.solicitation$(eventId, solicitation._userId)
      .delete();
  }

  private solicitation$(eventId: string, userId: string): AngularFirestoreDocument<Solicitation> {
    return this.fireStore
      .collection('events').doc(eventId)
      .collection('solicitations').doc<Solicitation>(userId);
  }

}
