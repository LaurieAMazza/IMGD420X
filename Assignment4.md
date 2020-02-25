### Laurie Mazza
[Play with it Here](https://LaurieAMazza.github.io/IMGD420X-Project-4/index.html)
### Assignment 4
For this assignment I wanted to create a simulation that seemingly "splattered" colors around the screen. I started to attempt this with Langton's ant as it reminded me of an art project that we use to do at a camp I worked at where each camper put paint on their feet and danced around on pieces of paper. The end result was colors ending up in both pattern like and random placement. I decided to go with interaction for this piece as I wanted the user to almost feel like they are creating a piece of art. 

### Code
[Repository](https://github.com/LaurieAMazza/IMGD420X-Project-4)

### Process
I started this assignment using Langton's ant. I started over using smoothlife as Langton's ant did not spread the color as I would have liked and multiple ants did not give me the effect I wanted. When starting over implementing smoothlife, I ran into multiple problems. gl-toy seemed to be part of my issues so I ended up switching to gl-now but having to go withing the shell.js file and switching out a line to fix and issue with fullscreen. Major issue that I ran into was the value being returned after the calculations being too small. My quick fix for this was to just multiple the value by a large number. I added in a GUI control as I wanted to give users control over the colors. However, in adding this I lost the multi-color effect as it limits the screen to a range of colors. 

### Feedback
The major feedback that I received was that it was underwhelming. This is something that I expected as I was not able to get the simulation to behave in a way that allowed an effect similar to my goal. There is only two colors at most on the screen depending on the user input. It is possible to end the simulation depending on the given input which adds a level of risk when playing around with it. Overall, this piece did not meet the goal I had in mind.
