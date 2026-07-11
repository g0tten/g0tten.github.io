---
layout: page
title: "Gotten for Cloud Simulators"
---

This example applies Gotten, a generic model-driven engineering framework for metamorphic testing, to cloud and data centre simulators.

### Running example for cloud simulators

The aim is to test cloud simulators that reproduce the behaviour of data centres under a given workload. The simulator inputs are therefore a data centre model and a workload model.

The following figure presents the meta-model used to represent data centres. A `DataCentre` contains a `Network` and any number of `Racks`. Each rack contains several `Boards`, which are connected through `Switches`. The boards also contain computing nodes whose characteristics are defined by `NodeTypes`.

![Data centre meta-model](https://raw.githubusercontent.com/g0tten/images/main/model/data_centre_mm.png)

### mrDSL program for data centres

Because it is difficult to define a conventional test oracle that determines whether a data centre simulator behaves correctly, this example uses metamorphic testing. The following listing shows the mrDSL program used to apply Gotten to the cloud simulator domain.

```
metamodel datacentre "/sample.gotten/model/datac.ecore" with m1, m2
models "/sample.gotten/model/dcmodels"
metamodel workload "/sample.gotten/model/workload.ecore" with w1, w2
models "/sample.gotten/model/workloads"

datacentre input Features {
	context DataCentre def: NNodes: Int = racks->collect(numBoards*board.nodesPerBoard)->sum()
	context DataCentre def: CPU: Int = racks->collect(numBoards*board.nodesPerBoard*board.nodeType.CPUCores*board.nodeType.CPUSpeed)->sum()
	context DataCentre def: NMachines: Int = racks->collect(numBoards*board.nodesPerBoard*board.nodeType.CPUCores)->sum()
	context DataCentre def: Storage: Int = racks->collect(numBoards*board.nodesPerBoard*board.nodeType.DiskSpeed)->sum()	
	context DataCentre def: Network: Int = net->collect(bandwidth)->sum()
	context DataCentre def: Memory: Int = racks->collect(numBoards*board.nodesPerBoard*board.nodeType.MEMSpeed)->sum()
}

workload input Features {
 	context WorkloadSet def: Workload: Set = workloads->collect(Traces)
 }

output Features {
	Time : Long
	Energy : Long
}
Processor {
	Name: String
	Version: String
}
MetamorphicRelations {
	MR1 = [(( CPU(m1) > CPU(m2) ) and ((w1) == (w2)) ) implies ((Energy(m1) <= Energy(m2)))]
	MR2 = [(( NMachines(m1) > NMachines(m2)) and ((w1) == (w2)) ) implies ((NMachines(m1)/NMachines(m2)) >= (Energy(m1)/Energy(m2)))]
	MR3 = [(( Storage(m1) > Storage(m2)) and ((w1) == (w2)) ) implies (Time(m1) <= Time(m2))]
	MR4 = [(( Network(m1) > Network(m2)) and ((w1) == (w2)) ) implies (Time(m1) <= Time(m2))]
	MR5 = [(( Memory(m1) > Memory(m2)) and ((w1) == (w2)) ) implies (Time(m1) < Time(m2))]
	MR6 = [( ((m1) == (m2)) and ( Workload(w1)->includes(Workload(w2))) ) implies (Time(m2) <= Time(m1))]
}
```

### Brief description of the metamorphic relations

The following table summarises the six metamorphic relations defined for the cloud simulator example.

Relation | Description |
--- | :--- |
MR1 | Data centre model `m1` has greater CPU capacity than `m2`, while workloads `w1` and `w2` are identical. |
&nbsp; | MR1i = [( CPU(m1) > CPU(m2) ) and ((w1) == (w2)) ] |
&nbsp; | The energy required to execute `w1` on `m1` should be less than or equal to that required to execute `w2` on `m2`. |
&nbsp; | MR1o = [ (Energy(m1) <= Energy(m2))] |
MR2 | Data centre model `m1` contains more physical machines than `m2`, while workloads `w1` and `w2` are identical. |
&nbsp; | MR2i = [( NMachines(m1) > NMachines(m2)) and ((w1) == (w2)) ] |
&nbsp; | The ratio between the numbers of machines in `m1` and `m2` should be greater than or equal to the corresponding ratio between their energy consumption values. |
&nbsp; | MR2o = [ (NMachines(m1)/NMachines(m2)) >= (Energy(m1)/Energy(m2))] |
MR3 | Data centre model `m1` has a faster storage system than `m2`, while workloads `w1` and `w2` are identical. |
&nbsp; | MR3i = [( Storage(m1) > Storage(m2)) and ((w1) == (w2)) ] |
&nbsp; | The execution time of `w1` on `m1` should be less than or equal to that of `w2` on `m2`. |
&nbsp; | MR3o = [ (Time(m1) <= Time(m2)) ] |
MR4 | Data centre model `m1` has a faster network than `m2`, while workloads `w1` and `w2` are identical. |
&nbsp; | MR4i = [( Network(m1) > Network(m2)) and ((w1) == (w2)) ] |
&nbsp; | The execution time of `w1` on `m1` should be less than or equal to that of `w2` on `m2`. |
&nbsp; | MR4o = [ (Time(m1) <= Time(m2)) ] |
MR5 | Data centre model `m1` has faster memory than `m2`, while workloads `w1` and `w2` are identical. |
&nbsp; | MR5i = [( Memory(m1) > Memory(m2)) and ((w1) == (w2)) ) |
&nbsp; | The execution time of `w1` on `m1` should be less than or equal to that of `w2` on `m2`. |
&nbsp; | MR5o = [ (Time(m1) <= Time(m2)) ] |
MR6 | Data centre models `m1` and `m2` are identical, and workload `w1` contains workload `w2`. |
&nbsp; | MR6i = [ ((m1) == (m2)) and ( Workload(w1)->includes(Workload(w2))) ] |
&nbsp; | The time required to execute `w2` on `m2` should be less than or equal to the time required to execute `w1` on `m1`. |
&nbsp; | MR6o = [ (Time(m2) <= Time(m1)) ] |

### Download the cloud projects

- [Simple Gotten cloud project](https://github.com/g0tten/sample/zipball/main)
- [Gotten cloud evaluation project](https://github.com/g0tten/evaluation/zipball/main)

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
