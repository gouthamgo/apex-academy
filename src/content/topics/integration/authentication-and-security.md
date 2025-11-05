---
title: "Integration Authentication and Security"
section: "integration"
order: 3
difficulty: "intermediate"
readTime: "22 min"
description: "Master authentication patterns for Salesforce integrations including OAuth 2.0, JWT, Named Credentials, and security best practices."
overview: "Learn how to secure integrations using industry-standard authentication and authorization patterns."
concepts: ["oauth", "jwt", "named-credentials", "connected-apps", "authentication", "authorization", "security"]
prerequisites: ["integration-fundamentals", "rest-api-integration-patterns"]
relatedTopics: ["platform-events", "rest-api-integration-patterns"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Authentication Patterns

## OAuth 2.0
Industry standard for API authorization

## JWT (JSON Web Token)
Secure token-based authentication

## Named Credentials
Salesforce-managed authentication

---

# Code Examples

## Named Credentials

```apex
public class NamedCredentialExample {
    
    public static String callExternalAPI() {
        HttpRequest req = new HttpRequest();
        // Named Credential handles auth automatically
        req.setEndpoint('callout:My_Named_Credential/api/data');
        req.setMethod('GET');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        return res.getBody();
    }
}
```

## OAuth 2.0 Flow

```apex
public class OAuthService {
    
    private static String accessToken;
    private static DateTime tokenExpiry;
    
    public static String getAccessToken() {
        if (accessToken != null && tokenExpiry > DateTime.now()) {
            return accessToken;
        }
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://auth.example.com/oauth/token');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        String body = 'grant_type=client_credentials' +
                     '&client_id=' + getClientId() +
                     '&client_secret=' + getClientSecret();
        req.setBody(body);
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> tokenResponse = 
                (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            
            accessToken = (String) tokenResponse.get('access_token');
            Integer expiresIn = (Integer) tokenResponse.get('expires_in');
            tokenExpiry = DateTime.now().addSeconds(expiresIn - 60);
            
            return accessToken;
        }
        
        throw new CalloutException('Failed to get access token');
    }
    
    private static String getClientId() {
        // Retrieve from Custom Metadata or Protected Custom Setting
        return 'your-client-id';
    }
    
    private static String getClientSecret() {
        // Retrieve from Protected Custom Setting
        return 'your-client-secret';
    }
}
```

---

# Security Best Practices

✅ Use Named Credentials for external auth
✅ Store credentials in Protected Custom Settings
✅ Implement token caching and refresh
✅ Use HTTPS for all callouts
✅ Validate and sanitize all input data

❌ Never hardcode credentials in code
❌ Don't log sensitive data
❌ Don't store passwords in plain text

---

# Related Topics

- **[REST API Integration](rest-api-integration-patterns)**
- **[Integration Fundamentals](integration-fundamentals)**
