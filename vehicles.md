---
layout: page
title: "Gotten for Autonomous Vehicles"
---

Gotten, Generic MDE framework fOr meTamorphic TEstiNg, for Autonomous Vehicles.

### Gotten for autonomous vehicles running example

The goal here is to test autonomous vehicle controllers that govern the behaviour of such vehicles while following a route under varying environmental conditions. To this end, the inputs to these systems are test-case models that describe elements such as the target nominal speed, the number of obstacles, and the sequence of reference waypoints.

### The mrDSL program for autonomous vehicles

Since it is difficult to establish an oracle to determine whether an autonomous vehicle controller S behaves as expected while navigating routes with different speeds, obstacles, and waypoints, we use MT. The following listing shows the mrDSL program created with the Gotten framework to apply MT to the autonomous vehicles domain.

```
avehicles input Features {
  nominalSpeed: Int	// Target nominal speed, at which the controller attempts to maintain the ego-vehicle whilst following the route.
  context TestCase_Input def: obstacleCount: Int = obstacles->size()
  context TestCase_Input def: waypointsCount: Int = refPoses->size()
}

avehicles output Features {
  timeToDestination: Int
  distance: Int
  balancing: Int
}

MetamorphicRelations {
  // Slower vehicles implies higher time to destination
  MR1  = [ (nominalSpeed(m1) > nominalSpeed(m2)) implies ((timeToDestination(m2) >= timeToDestination(m1)) and (distance(m2) <= distance(m1)))]
  // Less obstacles implies lower time to destination, Distance≈ (±15%)
  MR2  = [ (obstacleCount(m1) < obstacleCount(m2) ) implies ((timeToDestination(m1) <= timeToDestination(m2) ) and (distance(m2) - distance(m1) <= 0.15 * distance(m2) ))]
  // Less waypoints implies TTD≈, Distance≈ (±15%) 
  MR3  = [ (waypointsCount(m1) < waypointsCount(m2)) implies (timeToDestination(m2) - timeToDestination(m1) <= 0.15 * timeToDestination(m1) )]
}
```

### MRs for autonomous vehicles brief description

Below we provide a brief description of these 3 MRs for autonomous vehicles:

Relation | Description |
--- | :--- |
MR1 | The autonomous vehicle scenario m1 has a higher nominal speed than m2. |
&nbsp; | MR1i = [ (nominalSpeed(m1) > nominalSpeed(m2)) ] |
&nbsp; | The time to destination in m2 should be greater than or equal to that in m1, and the distance travelled in m2 should be less than or equal to that in m1. |
&nbsp; | MR1o = [ (timeToDestination(m2) >= timeToDestination(m1)) and (distance(m2) <= distance(m1)) ] |
MR2 | The autonomous vehicle scenario m1 contains fewer obstacles than m2. |
&nbsp; | MR2i = [ (obstacleCount(m1) < obstacleCount(m2)) ] |
&nbsp; | The time to destination in m1 should be less than or equal to that in m2, and the difference in travelled distance should not exceed 15% of the distance in m2. |
&nbsp; | MR2o = [ (timeToDestination(m1) <= timeToDestination(m2)) and (distance(m2) - distance(m1) <= 0.15 * distance(m2)) ] |
MR3 | The autonomous vehicle scenario m1 contains fewer waypoints than m2. |
&nbsp; | MR3i = [ (waypointsCount(m1) < waypointsCount(m2)) ] |
&nbsp; | The difference in time to destination between m2 and m1 should not exceed 15% of the time to destination in m1. |
&nbsp; | MR3o = [ (timeToDestination(m2) - timeToDestination(m1) <= 0.15 * timeToDestination(m1)) ] |

### Gotten for autonomous vehicles projects download links

### Acknowledgements

This work has been funded by the Spanish Ministry of Science (RTI2018-095255-B-I00, project "MASSIVE") and the R&D programme of Madrid (P2018/TCS-4314, project "[FORTE](https://antares.sip.ucm.es/forte-cm/)").
