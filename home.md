
We propose a model-driven engineering approach to automate the construction of Metamorphic Testing (MT) environments. Starting from a meta-model capturing the domain concepts, and a description of the domain execution environment, our approach produces an MT environment featuring comprehensive support for the MT process. This includes the definition of domain-specific Metamorphic Relations (MRs), their evaluation, detailed reporting of the testing results, and the automated search-based generation of follow-up test cases.

### The mrDSL language for the definition and execution of MRs

With that purpose, the Gotten environment provides a DSL called mrDSL to define and execute MRs. There you can declare the domain meta-models and the instance names used, the input features, that are defined by means of an OCL expression, the output features, the processors' attributes and the MRs. 

```
metamodel datacentre "/sample.gotten/model/datac.ecore" with m1, m2
models "/sample.gotten/model/dcmodels"
metamodel workload "/sample.gotten/model/workload.ecore" with w1, w2
models "/sample.gotten/model/workloads"

datacentre input Features {
	context DataCentre def: NNodes: Int = racks->collect(numBoards*board.nodesPerBoard)->sum()
	context DataCentre def: CPU: Int = racks->collect(
            numBoards*board.nodesPerBoard*board.nodeType.CPUCores*board.nodeType.CPUSpeed)->sum()
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
	MR1 = [(( NNodes(m1) > NNodes(m2) ) and ((w1) == (w2)) ) implies ((Time(m1) <= Time(m2)))]
	MR2 = [(( CPU(m1) > CPU(m2) ) and ((w1) == (w2)) ) implies ((Energy(m1) <= Energy(m2)))]
}

```

### The fowDSL language for the follow-up test cases generation

Gotten provides a DSL for the follow-up test cases generation called fowDSL. The followup-test cases generation method is based on [MOMoT](http://martin-fleck.github.io/momot/). There you can define the conditions of the followup-test cases generation for each MR. You can define for the corresponding feature the desired operations to increase/decrease numeric attributes or to create/delete objects, also setting the operation limits.

```
followups for datacentre using MR1
with source folder = "/sample.gotten/model/dcmodels"
and output folder = "/sample.gotten/model/dcmodels"

NNodes ->  decrease [1..4] Rack.numBoards keeping {Rack.numBoards > 0};
           decrease [1..4] Board.nodesPerBoard keeping {Board.nodesPerBoard > 0}

maximize ( NNodes(m2) - NNodes(m1) )

maxSolutions 10
iterations 2                               
algorithms [Random, NSGAII, NSGAIII, eMOEA]
```

### Gotten installation

- [Gotten environment update-site](https://g0tten.github.io/gotten/update-site) to be used from the Eclipse Install New Software facility:

![Gotten installation](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_update-site.png)

<!--You also need to have installed [Java 11](https://www.oracle.com/es/java/technologies/javase/jdk11-archive-downloads.html) in your local machine: 

![Java 11](https://raw.githubusercontent.com/g0tten/images/main/ide/java11.png)
-->

- For Windows users, we provide this [Standalone Eclipse+Gotten for Windows](https://www.dropbox.com/scl/fi/4wkuc4rnwqs05flblfgwf/eclipse.zip?rlkey=h3ah81erbr4gjlqo62rstwq0b&dl=0) version.
- For Ubuntu users, we provide this [Standalone Eclipse+Gotten for Ubuntu](https://www.dropbox.com/scl/fi/8cvgiek4snm8xmu6cao6w/eclipse.zip?rlkey=7jsnd7stb879u95iaruucranf&dl=0) version.
- To use Gotten directly, we provide this [Ubuntu 20.04 VirtualBox VM+Gotten](https://www.dropbox.com/s/m4s7rjk1tywl8cf/Ubuntu-20.04.x64-Gotten.zip?dl=0) version.

### Gotten for cloud projects

- [Gotten for cloud simple project](https://github.com/g0tten/sample/zipball/main)
- [Gotten for cloud evaluation project](https://github.com/g0tten/evaluation/zipball/main)

### Gotten for video streaming APIs

- [Gotten for YouTube and Vimeo](https://github.com/g0tten/video/zipball/main)

### The Gotten environment in action

- This is the Gotten development environment in action (click on image to see YouTube demo):

[![Gotten environment in action](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_screenshot.png)](https://youtu.be/PVVtZCxcnNc)

### Presentation of the Gotten environment

- A short introduction video presentation of the Gotten environment (click on image to see YouTube presentation):

[![Gotten environment presentation](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_screenshot2.png)](https://youtu.be/DeuIW6V4LaQ)

- This is the Gotten wizard to execute the MT process:

![Gotten wizard](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_wizard.png)

### Authors and contributors

Gotten has been developed by [Pablo Gómez-Abajo](https://github.com/gomezabajo), [Pablo C. Cañizares](https://github.com/PabloCCanizares), [Alberto Núñez](https://github.com/albenune), [Esther Guerra](https://github.com/estherguerra) and [Juan de Lara](https://github.com/jdelara). At this point, we would like to thank the developers of the following frameworks, which we have used in order to develop Gotten:

- [Xtext](https://www.eclipse.org/Xtext/): Xtext tailors the development of programming languages and domain-specific languages. With Xtext you define your language using a powerful grammar language.
- [Henshin](https://www.eclipse.org/henshin/): Henshin is used to formulate the transformation units to manipulate the model.
- [MOMoT](http://martin-fleck.github.io/momot/): MOMoT is a framework that combines MDE techniques with search-based optimization (population-based search and local search) to solve highly complex problems on model level.

### Related publications

3. [<span style="font-variant:small-caps;">Gotten</span>: A model-driven solution to engineer domain-specific metamorphic testing environments](https://ieeexplore.ieee.org/document/10350786). Pablo Gómez-Abajo, Pablo C. Cañizares, Alberto Núñez, Esther Guerra, Juan de Lara. 2023. In [*ACM/IEEE 26th International Conference on Model Driven Engineering Languages and Systems (MoDELS 2023)*](https://conf.researchr.org/home/models-2023), Västerås.
2. [Automated engineering of domain-specific metamorphic testing environments](https://www.sciencedirect.com/science/article/pii/S0950584923000186). Pablo Gómez-Abajo, Pablo C. Cañizares, Alberto Núñez, Esther Guerra, Juan de Lara. 2023. In [*Information and Software Technology*](https://www.sciencedirect.com/journal/information-and-software-technology) (Elsevier).
1. [New ideas: Automated engineering of metamorphic testing environments for domain-specific languages](https://dl.acm.org/doi/10.1145/3486608.3486904). Pablo C. Cañizares, Pablo Gómez-Abajo, Alberto Núñez, Esther Guerra, Juan de Lara. 2021. In [*ACM SIGPLAN International Conference on Software Language Engineering (SLE 2021)*](https://conf.researchr.org/home/sle-2021?), Chicago. **Best new ideas/vision paper award at SLE'21**.
{: reversed="reversed"}

### Acknowledgements

This work has been funded by the Spanish Ministry of Science (RTI2018-095255-B-I00, project "MASSIVE") and the R&D programme of Madrid (P2018/TCS-4314, project "[FORTE](https://antares.sip.ucm.es/forte-cm/)").
