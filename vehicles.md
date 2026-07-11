---
layout: page
title: "Gotten for Autonomous Vehicles"
---

This example applies Gotten, a generic model-driven engineering framework for metamorphic testing, to autonomous vehicles.

### Running example for autonomous vehicles

The aim is to test controllers that govern autonomous vehicles as they follow a route under different environmental conditions. The system inputs are test-case models that describe aspects such as the target nominal speed, the number of obstacles, and the sequence of reference waypoints.

### mrDSL program for autonomous vehicles

Because it is difficult to define a conventional test oracle that determines whether an autonomous vehicle controller behaves correctly across routes with different speeds, obstacles, and waypoints, this example uses metamorphic testing. The following listing shows the mrDSL program used to apply Gotten to the autonomous vehicle domain.

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

### Brief description of the metamorphic relations

The following table summarises the three metamorphic relations defined for the autonomous vehicle example.

Relation | Description |
--- | :--- |
MR1 | Scenario `m1` has a higher nominal speed than scenario `m2`. |
&nbsp; | MR1i = [ (nominalSpeed(m1) > nominalSpeed(m2)) ] |
&nbsp; | The time to destination in `m2` should be greater than or equal to that in `m1`, while the distance travelled in `m2` should be less than or equal to that in `m1`. |
&nbsp; | MR1o = [ (timeToDestination(m2) >= timeToDestination(m1)) and (distance(m2) <= distance(m1)) ] |
MR2 | Scenario `m1` contains fewer obstacles than scenario `m2`. |
&nbsp; | MR2i = [ (obstacleCount(m1) < obstacleCount(m2)) ] |
&nbsp; | The time to destination in `m1` should be less than or equal to that in `m2`, and the difference in distance travelled should not exceed 15% of the distance in `m2`. |
&nbsp; | MR2o = [ (timeToDestination(m1) <= timeToDestination(m2)) and (distance(m2) - distance(m1) <= 0.15 * distance(m2)) ] |
MR3 | Scenario `m1` contains fewer waypoints than scenario `m2`. |
&nbsp; | MR3i = [ (waypointsCount(m1) < waypointsCount(m2)) ] |
&nbsp; | The difference between the times to destination in `m2` and `m1` should not exceed 15% of the time to destination in `m1`. |
&nbsp; | MR3o = [ (timeToDestination(m2) - timeToDestination(m1) <= 0.15 * timeToDestination(m1)) ] |

### Downloads

No project download link is listed in the current version of this page.

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
