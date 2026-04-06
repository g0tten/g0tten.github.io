---
layout: page
title: "Gotten for Finite Automata"
---

Gotten, Generic MDE framework fOr meTamorphic TEstiNg, for Finite Automata and Words.

### Gotten for finite automata and words running example

The goal here is to test finite automata that recognise words belonging to a given language. To this end, the inputs of these systems consist of automaton models and word models representing the strings to be processed.

### The mrDSL program for finite automata and words

Since it is difficult to establish an oracle to determine whether a finite automaton S correctly accepts or rejects words according to the target language, we use MT. The following listing shows the mrDSL program created with the Gotten framework to apply MT to the finite automata and words domain.

```
dfa input Features {
  context Automaton def: FinalStates: Set = states->select(isFinal = true)->collect(name)->asSet()
  context Automaton def: NonFinalStates: Set = states->select(isFinal = false)->collect(name)->asSet()    
}

word input Features {
  context Words def: Word: List = symbol
}

output Features {  	// this takes two arguments, the automaton and the word
  Result : Boolean	// True if word accepted, false otherwise
}

MetamorphicRelations {
  // if the non-final states of automaton x1 are equal to the final states of x2, then if x1 accepts a word, the other automata must reject it, and vice-versa 
  MR1 = [(NonFinalStates(x1) == FinalStates(x2)) implies ( (Result(x1, w1) and not Result(x2, w1) ) or ( not Result(x1, w1) and Result(x2, w1)) )	]
  // if a first automaton x1 differs from a second automaton x2 only by having a subset of final states
  // then any word accepted by the first automaton must also be accepted by the second one
  MR2 = [	( FinalStates(x2)->includesAll(FinalStates(x1)) ) implies ( not Result(x1, w1) or Result(x2, w1) ) ]    
  // We are testing an automata for (0+1)*0. Hence, if we append a '1' to any word ending in '0'  
  // then the automata accepts the word ending in '0' and rejects the word ending in '1' 
  MR3 = [ (Word(w1)->last() == '0' and Word(w1)->add('1') == Word(w2)) 	implies ( Result(x1, w1) and not Result(x1, w2))]
  // We are testing an automata for (0+1)*0. If a word with length at least 2 ends in the symbol '0' and a second word is 
  // obtained by removing the first symbol of the first word, then both words must be accepted
  MR4 = [ (Word(w1)->last() == '0' and Word(w1)->size() > 1 and Word(w1)->remove(0) == Word(w2)) implies (Result(x1, w1) and Result(x1, w2))]
}
```

### MRs for finite automata and words brief description

Below we provide a brief description of these 2 MRs for finite automata and 2 MRs for processed words:

Relation | Description |
--- | :--- |
MR1 | The non-final states of automaton x1 are equal to the final states of automaton x2. |
&nbsp; | MR1i = [ (NonFinalStates(x1) == FinalStates(x2)) ] |
&nbsp; | If x1 accepts a word, then x2 must reject it; and if x1 rejects it, then x2 must accept it. |
&nbsp; | MR1o = [ (Result(x1, w1) and not Result(x2, w1)) or (not Result(x1, w1) and Result(x2, w1)) ] |
MR2 | The set of final states of automaton x2 includes all final states of automaton x1. |
&nbsp; | MR2i = [ (FinalStates(x2)->includesAll(FinalStates(x1))) ] |
&nbsp; | Any word accepted by x1 must also be accepted by x2. |
&nbsp; | MR2o = [ (not Result(x1, w1) or Result(x2, w1)) ] |
MR3 | We are testing an automaton for the language (0+1)*0. The word w2 is obtained by appending the symbol '1' to a word w1 ending in '0'. |
&nbsp; | MR3i = [ (Word(w1)->last() == '0' and Word(w1)->add('1') == Word(w2)) ] |
&nbsp; | The automaton must accept w1 and reject w2. |
&nbsp; | MR3o = [ (Result(x1, w1) and not Result(x1, w2)) ] |
MR4 | We are testing an automaton for the language (0+1)*0. The word w1 has length greater than 1 and ends in '0', and w2 is obtained by removing the first symbol of w1. |
&nbsp; | MR4i = [ (Word(w1)->last() == '0' and Word(w1)->size() > 1 and Word(w1)->remove(0) == Word(w2)) ] |
&nbsp; | The automaton must accept both w1 and w2. |
&nbsp; | MR4o = [ (Result(x1, w1) and Result(x1, w2)) ] |

### Gotten for finite automata download links

### Acknowledgements

This work has been funded by the Spanish Ministry of Science (RTI2018-095255-B-I00, project "MASSIVE") and the R&D programme of Madrid (P2018/TCS-4314, project "[FORTE](https://antares.sip.ucm.es/forte-cm/)").
