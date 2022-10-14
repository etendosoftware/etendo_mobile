# Test

To test this component in Storybook mobile, the following commands must be executed via console.

`yarn install && npx react-native run-android && npx react-native start`

In turn, to test it in Storybook web, the following command will open a window in your browser rendering it.

`yarn storybook`

# Notes:

This component presents a horizontal scroll view in order to cover the case in which the number of TabItems containing Tabs is wider than the width of the screen on which they will be rendered.

It is possible that when typing the two commands described in "When", the screen may have to be reloaded by pressing the "R" key on the keyboard.

It is worth mentioning that in this first instance this component is made up of two styles, which are primary and secondary. However, each new Tab design that is presented I will add it to this component so that it can be used in any Etendo project.
