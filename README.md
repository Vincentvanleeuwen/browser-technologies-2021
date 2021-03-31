# Pollerrr

For the class browser technologies I will be creating a progressively enhanced polling web app. 

**The core functionalities** 

- Creating a poll list
- Creating a poll
- Answering polls
- Seeing the poll results

## Wireflow
![alt text](https://github.com/Vincentvanleeuwen/browser-technologies-2021/blob/master/img/schets2.jpg "Sketch Poller")
![alt text](https://github.com/Vincentvanleeuwen/browser-technologies-2021/blob/master/img/schets3.jpg "Sketch Enhancement")

## Installation Guide

```jsx
// Clone the repository
git clone https://github.com/Vincentvanleeuwen/browser-technologies-2021.git

// Install the packages

npm i

// Start the project @http://localhost:3000/
npm run test
```

## Techniques used

In this project I will be making use of the following important packages.

- Node JS
- Express JS
- Firebase
- Express Handlebars

## User testing 

I'm developing on the Google Chrome browser.

I will test on the following browsers:
- Firefox on a Windows 10 computer
- Android Browser on a Samsung Galaxy S10
- Safari on an Apple iPad

### Firefox on a Windows 10 computer

The first bug I saw on Firefox was that the fonts weren't adding up. They were all displaying the default font. I then checked and saw that my body didn't contain the correct font, so I added it.

(left picture = bug) (right picture = fix)
![alt text](https://github.com/Vincentvanleeuwen/browser-technologies-2021/blob/master/img/firefox-font.png "Firefox Fonts")


While reaching the result page I stumbled upon the meter element. This element is not liked by firefox as much as you can see. Luckily theres @-moz-document url-prefix(), this allows you to add styles to just the browser firefox.

(left picture = bug) (right picture = fix)
![alt text](https://github.com/Vincentvanleeuwen/browser-technologies-2021/blob/master/img/firefox-meter.png "Firefox Meter")

### Safari on an Apple iPad
On the iPad I noticed straight away that the submit buttons had a weird gradient. Luckily enough you can select all apple devices by using the code: @supports (-webkit-touch-callout: none) because only apple devices allow this piece of code.

(left picture = bug) (right picture = fix)
![alt text](https://github.com/Vincentvanleeuwen/browser-technologies-2021/blob/master/img/safari-buttons.jpg "Safari Submit Buttons")

### Android Browser on a Samsung Galaxy S10

The same problem occurred on the android browser as on Firefox. The result meter element went out of proportion and turned green. Luckily by adding code that only applies to small screens (apple or android) it'll put the meter element back in proportion.

## Checklist 

- [x] Create a poll list
- [x] Dynamic poll routes
- [x] 404 page
- [x] Create a poll
- [x] Answer polls
- [x] Reviewing answers
- [x] Progressive enhanced drag & drop

## Sources

[The one and only Jonah Gold](https://github.com/theonejonahgold)

[Wouter](https://github.com/Mokerstier) 

[Roeland](https://github.com/roelandvs)

[Ben](https://github.com/benl95)

[Firebase References](https://firebase.google.com/docs/reference)

[Handlebars](https://handlebarsjs.com/guide/)

[How to target ios devices](https://stackoverflow.com/questions/30102792/css-media-query-to-target-only-ios-devices)

[Drag and Drop](https://medium.com/@jaouad_45834/drag-drop-with-vanilla-javascript-d20bda85afe6)
