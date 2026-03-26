import { useState, useCallback, useRef } from 'react';
import { ruleCards } from '../data/rule_cards';

export function useRuleProgress() {
  // { rule_tag: consecutiveCorrectCount }
  const ruleProgress = useRef({});
  // Set of rule_tags already triggered this session
  const triggeredRules = useRef(new Set());
  // Force re-render trigger
  const [, setTick] = useState(0);

  const onCorrect = useCallback((question) => {
    const tag = question?.rule_tag;
    if (!tag) return null;

    ruleProgress.current[tag] = (ruleProgress.current[tag] || 0) + 1;

    const card = ruleCards.find(r => r.rule_tag === tag);
    const threshold = card?.trigger_count || 5;

    if (
      ruleProgress.current[tag] >= threshold &&
      !triggeredRules.current.has(tag)
    ) {
      triggeredRules.current.add(tag);
      setTick(t => t + 1);
      return tag; // Return the tag so caller can display card
    }
    return null;
  }, []);

  const onError = useCallback((question) => {
    const tag = question?.rule_tag;
    if (tag) {
      ruleProgress.current[tag] = 0;
    }
  }, []);

  const getRuleCard = useCallback((ruleTag) => {
    return ruleCards.find(r => r.rule_tag === ruleTag) || null;
  }, []);

  return { onCorrect, onError, getRuleCard };
}
