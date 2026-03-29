// Package security provides L1/L2/L3 security detection for ZeroTrust AI Gateway.
package security

import (
	"regexp"
	"strings"

	"golang.org/x/text/encoding/simplifiedchinese"
)

// SensitivePattern represents a pattern to detect.
type SensitivePattern struct {
	Category string // e.g., "api_key", "password", "database"
	Pattern  string // regex or keyword
	Severity string // critical, high, medium, low
	Action   string // block, warn, log
	IsRegex  bool
}

// L1Detector implements L1 (pattern-based) sensitive data detection using Aho-Corasick.
type L1Detector struct {
	patterns    []SensitivePattern
	acAutomaton *ACTrie
	compiled    bool
}

// ACTrie implements Aho-Corasick automaton for fast multi-pattern matching.
type ACTrie struct {
	root *ACTrieNode
}

// ACTrieNode represents a node in the AC automaton.
type ACTrieNode struct {
	children map[rune]*ACTrieNode
	fail     *ACTrieNode
	output   []int
	depth    int
}

// DetectionResult represents a detection result.
type DetectionResult struct {
	Matched    bool
	Patterns   []string
	Categories []string
	Severity   string
	Action     string
	Confidence float64
}

// NewL1Detector creates a new L1 detector with default patterns.
func NewL1Detector() *L1Detector {
	detector := &L1Detector{
		patterns: getDefaultPatterns(),
	}
	detector.buildAutomaton()
	return detector
}

// getDefaultPatterns returns default sensitive data patterns for L1 detection.
func getDefaultPatterns() []SensitivePattern {
	return []SensitivePattern{
		// API Keys
		{Category: "api_key", Pattern: `(?i)(sk|pk|api[-_]?key|apikey|api[-_]?token|secret[-_]?key)\s*[:=]\s*['"]?[a-zA-Z0-9_-]{20,}`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "openai_key", Pattern: `sk-[a-zA-Z0-9]{48}`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "anthropic_key", Pattern: `(?i)sk-ant-[a-zA-Z0-9]{48,}`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "aws_access_key", Pattern: `(?i)AKIA[0-9A-Z]{16}`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "aws_secret_key", Pattern: `(?i)['"][a-zA-Z0-9/+=]{40}['"]`, Severity: "critical", Action: "block", IsRegex: true},

		// Database Connection Strings
		{Category: "database", Pattern: `(?i)(mongodb|postgres|mysql|redis|sqlserver):\/\/[^\s'"]+`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "database", Pattern: `(?i)(password|pwd|pass)\s*[:=]\s*['"]?[^\s'"]+`, Severity: "high", Action: "block", IsRegex: true},

		// Private Keys
		{Category: "private_key", Pattern: `-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "jwt_token", Pattern: `eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*`, Severity: "high", Action: "warn", IsRegex: true},

		// Credentials
		{Category: "password", Pattern: `(?i)(password|pwd|passwd|pass)\s*[:=]\s*['"]?[^\s'"]+`, Severity: "high", Action: "block", IsRegex: true},
		{Category: "secret", Pattern: `(?i)(secret|token|auth)\s*[:=]\s*['"]?[a-zA-Z0-9_-]{10,}`, Severity: "high", Action: "warn", IsRegex: true},

		// Personal Data
		{Category: "ssn", Pattern: `\b\d{3}-\d{2}-\d{4}\b`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "credit_card", Pattern: `\b(?:\d{4}[- ]?){3}\d{4}\b`, Severity: "critical", Action: "block", IsRegex: true},
		{Category: "phone", Pattern: `(?i)\b\d{3}[-.]?\d{3}[-.]?\d{4}\b`, Severity: "medium", Action: "warn", IsRegex: true},
		{Category: "email", Pattern: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`, Severity: "low", Action: "log", IsRegex: true},

		// IP Addresses (internal)
		{Category: "internal_ip", Pattern: `\b(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b`, Severity: "medium", Action: "warn", IsRegex: true},
	}
}

// buildAutomaton builds the Aho-Corasick automaton from patterns.
func (d *L1Detector) buildAutomaton() {
	d.acAutomaton = NewACTrie()
	for i, p := range d.patterns {
		if !p.IsRegex {
			// Add keyword to AC automaton
			d.acAutomaton.Insert([]rune(p.Pattern), i)
		}
	}
	d.acAutomaton.Build()
	d.compiled = true
}

// Detect performs L1 detection on the input text.
func (d *L1Detector) Detect(text string) DetectionResult {
	result := DetectionResult{
		Severity:   "low",
		Action:     "allow",
		Confidence: 0.0,
	}

	if text == "" {
		return result
	}

	matchedCategories := make(map[string]bool)
	matchedPatterns := 0
	highestSeverity := 0

	severityOrder := map[string]int{
		"critical": 4,
		"high":     3,
		"medium":   2,
		"low":      1,
	}

	// Check regex patterns first
	for _, p := range d.patterns {
		if p.IsRegex {
			re := regexp.MustCompile(p.Pattern)
			if re.MatchString(text) {
				matchedPatterns++
				matchedCategories[p.Category] = true
				if severityOrder[p.Severity] > highestSeverity {
					highestSeverity = severityOrder[p.Severity]
					result.Severity = p.Severity
					result.Action = p.Action
				}
			}
		}
	}

	// Check keyword patterns using AC automaton
	if d.compiled && d.acAutomaton != nil {
		matches := d.acAutomaton.Search(text)
		for _, idx := range matches {
			if idx < len(d.patterns) {
				p := d.patterns[idx]
				matchedPatterns++
				matchedCategories[p.Category] = true
				if severityOrder[p.Severity] > highestSeverity {
					highestSeverity = severityOrder[p.Severity]
					result.Severity = p.Severity
					result.Action = p.Action
				}
			}
		}
	}

	if matchedPatterns > 0 {
		result.Matched = true
		result.Confidence = 0.95 // L1 has high confidence due to pattern matching

		for cat := range matchedCategories {
			result.Categories = append(result.Categories, cat)
		}
	}

	return result
}

// DetectRequest checks both prompt and context for sensitive data.
func (d *L1Detector) DetectRequest(prompt string, systemPrompt string, history string) DetectionResult {
	// Combine all text for detection
	allText := prompt
	if systemPrompt != "" {
		allText += " " + systemPrompt
	}
	if history != "" {
		allText += " " + history
	}

	return d.Detect(allText)
}

// NewACTrie creates a new AC Trie.
func NewACTrie() *ACTrie {
	return &ACTrie{
		root: &ACTrieNode{
			children: make(map[rune]*ACTrieNode),
		},
	}
}

// Insert inserts a pattern into the trie.
func (t *ACTrie) Insert(pattern []rune, index int) {
	node := t.root
	for _, ch := range pattern {
		if node.children[ch] == nil {
			node.children[ch] = &ACTrieNode{
				children: make(map[rune]*ACTrieNode),
			}
		}
		node = node.children[ch]
	}
	node.output = append(node.output, index)
}

// Build builds the failure links for the AC automaton.
func (t *ACTrie) Build() {
	if t.root == nil {
		return
	}
	queue := make([]*ACTrieNode, 0)

	// Initialize failure links for depth 1 nodes (children of root)
	for _, child := range t.root.children {
		child.fail = t.root
		queue = append(queue, child)
	}

	// BFS to build failure links
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		for ch, child := range current.children {
			queue = append(queue, child)

			// Find failure link
			fail := current.fail
			for fail != nil && fail != t.root && fail.children[ch] == nil {
				fail = fail.fail
			}

			if fail == nil {
				child.fail = t.root
			} else {
				child.fail = fail.children[ch]
				if child.fail == nil {
					child.fail = t.root
				}
			}

			// Merge outputs
			if len(child.fail.output) > 0 {
				child.output = append(child.output, child.fail.output...)
			}
		}
	}
}

// Search searches for all pattern matches in the text.
func (t *ACTrie) Search(text string) []int {
	matches := make([]int, 0)
	node := t.root

	for _, ch := range text {
		// GBK encoding detection for Chinese text
		if isGBKChar(ch) {
			// Try both GBK characters combined
			combined := tryConvertGBK(ch, text)
			if combined != nil {
				for _, c := range combined {
					node = t.walk(node, c)
				}
			}
		}

		for node != nil && node.children[ch] == nil {
			node = node.fail
		}
		if node == nil {
			node = t.root
			continue
		}
		node = node.children[ch]

		if len(node.output) > 0 {
			matches = append(matches, node.output...)
		}
	}

	return matches
}

func (t *ACTrie) walk(node *ACTrieNode, ch rune) *ACTrieNode {
	if node.children[ch] != nil {
		return node.children[ch]
	}
	if node.fail != nil {
		return t.walk(node.fail, ch)
	}
	return t.root
}

// isGBKChar checks if a rune could be part of a GBK encoded character.
func isGBKChar(ch rune) bool {
	return ch >= 0x4E00 && ch <= 0x9FFF // Chinese character range
}

// tryConvertGBK attempts to convert potential GBK bytes to characters.
func tryConvertGBK(firstChar rune, text string) []rune {
	// Simplified GBK detection - in production, use proper encoding detection
	return nil
}

// DetectChineseText handles Chinese text by converting to UTF-8 compatible representation.
func (d *L1Detector) DetectChineseText(text string) DetectionResult {
	// Convert GBK to UTF-8 if needed
	utf8Text, err := simplifiedchinese.GBK.NewDecoder().String(text)
	if err != nil {
		return d.Detect(text) // Fallback to original
	}
	return d.Detect(utf8Text)
}

// AddPattern adds a custom pattern to the detector.
func (d *L1Detector) AddPattern(pattern SensitivePattern) {
	d.patterns = append(d.patterns, pattern)
	d.buildAutomaton() // Rebuild automaton with new patterns
}

// GetPatterns returns all current patterns.
func (d *L1Detector) GetPatterns() []SensitivePattern {
	return d.patterns
}

// Redact replaces matched sensitive data with mask.
func (d *L1Detector) Redact(text string, mask rune) string {
	result := text

	for _, p := range d.patterns {
		if p.IsRegex {
			re := regexp.MustCompile(p.Pattern)
			result = re.ReplaceAllStringFunc(result, func(match string) string {
				return strings.Repeat(string(mask), len(match))
			})
		}
	}

	return result
}
