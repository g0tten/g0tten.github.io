---
layout: page
title: "Gotten for Finite Automata"
---

This example applies Gotten, a generic model-driven engineering framework for metamorphic testing, to finite automata and words.

### Running example for finite automata and words

The aim is to test finite automata that recognise words belonging to a given language. The system inputs therefore consist of automaton models and word models representing the strings to be processed.

### mrDSL program for finite automata and words

Because it is difficult to define a conventional test oracle that determines whether a finite automaton correctly accepts or rejects words in the target language, this example uses metamorphic testing. The following listing shows the mrDSL program used to apply Gotten to finite automata and words.

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

### Brief description of the metamorphic relations

The following table summarises two relations between finite automata and two relations between processed words.

Relation | Description |
--- | :--- |
MR1 | The non-final states of automaton `x1` are equal to the final states of automaton `x2`. |
&nbsp; | MR1i = [ (NonFinalStates(x1) == FinalStates(x2)) ] |
&nbsp; | If `x1` accepts a word, `x2` must reject it; conversely, if `x1` rejects the word, `x2` must accept it. |
&nbsp; | MR1o = [ (Result(x1, w1) and not Result(x2, w1)) or (not Result(x1, w1) and Result(x2, w1)) ] |
MR2 | The set of final states of automaton `x2` includes all the final states of automaton `x1`. |
&nbsp; | MR2i = [ (FinalStates(x2)->includesAll(FinalStates(x1))) ] |
&nbsp; | Every word accepted by `x1` must also be accepted by `x2`. |
&nbsp; | MR2o = [ (not Result(x1, w1) or Result(x2, w1)) ] |
MR3 | The automaton recognises the language `(0+1)*0`. Word `w2` is obtained by appending the symbol `1` to a word `w1` that ends in `0`. |
&nbsp; | MR3i = [ (Word(w1)->last() == '0' and Word(w1)->add('1') == Word(w2)) ] |
&nbsp; | The automaton must accept `w1` and reject `w2`. |
&nbsp; | MR3o = [ (Result(x1, w1) and not Result(x1, w2)) ] |
MR4 | The automaton recognises the language `(0+1)*0`. Word `w1` has more than one symbol and ends in `0`; `w2` is obtained by removing the first symbol of `w1`. |
&nbsp; | MR4i = [ (Word(w1)->last() == '0' and Word(w1)->size() > 1 and Word(w1)->remove(0) == Word(w2)) ] |
&nbsp; | The automaton must accept both `w1` and `w2`. |
&nbsp; | MR4o = [ (Result(x1, w1) and Result(x1, w2)) ] |

### Downloads

Download links for this example will be provided when the corresponding project is published.

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
